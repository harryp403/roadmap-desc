import { addMonths, differenceInMonths, isSameMonth, isWithinInterval } from 'date-fns';
import { Intervention } from '@/types/interventions';

export function calculateYearlyCosts(
  intervention: Intervention,
  yearStart: Date,
  yearEnd: Date
) {
  const implementationCost = isWithinInterval(intervention.timeline.implementationStartDate, {
    start: yearStart,
    end: yearEnd,
  })
    ? intervention.costs.implementationCost
    : 0;

  const oneTimeFixedFee = isWithinInterval(intervention.timeline.ongoingStartDate, {
    start: yearStart,
    end: yearEnd,
  })
    ? intervention.costs.oneTimeFixedFee
    : 0;

  // Calculate PEPM costs
  let pepmCost = 0;
  if (intervention.eligibleEmployees) {
    const monthlyPEPM = intervention.costs.ongoingCostPEPM * intervention.eligibleEmployees;
    const startDate = intervention.timeline.ongoingStartDate;
    const endDate = intervention.timeline.ongoingEndDate;

    // Count full months within the year
    let months = 0;
    let currentDate = new Date(Math.max(startDate.getTime(), yearStart.getTime()));
    const yearEndTime = yearEnd.getTime();
    const interventionEndTime = endDate.getTime();

    while (
      currentDate.getTime() <= yearEndTime &&
      currentDate.getTime() <= interventionEndTime
    ) {
      months++;
      currentDate = addMonths(currentDate, 1);
    }

    pepmCost = monthlyPEPM * months;
  }

  // Calculate fixed annual cost
  const fixedAnnualCost =
    isWithinInterval(intervention.timeline.ongoingStartDate, {
      start: yearStart,
      end: yearEnd,
    }) ||
    (intervention.timeline.ongoingStartDate < yearStart &&
      intervention.timeline.ongoingEndDate > yearStart)
      ? intervention.costs.ongoingCostFixed
      : 0;

  return {
    implementationCost,
    oneTimeFixedFee,
    pepmCost,
    fixedAnnualCost,
    total: implementationCost + oneTimeFixedFee + pepmCost + fixedAnnualCost,
  };
}

export function calculateTotalYearlyCosts(
  interventions: Intervention[],
  yearStart: Date,
  yearEnd: Date
) {
  return interventions.reduce(
    (total, intervention) =>
      total + calculateYearlyCosts(intervention, yearStart, yearEnd).total,
    0
  );
} 