import { addMonths, differenceInMonths, isWithinInterval, isBefore, isAfter, addDays } from 'date-fns';
import { Intervention } from '@/types/interventions';

/**
 * Creates a properly formatted date for the end of a year period (day before the next year starts)
 * @param startDate Start date of the year
 * @returns End date (one day before next year starts)
 */
export function getYearEndDate(startDate: Date): Date {
  // Create a date exactly one year after the start date
  const nextYearStart = addMonths(startDate, 12);
  // Subtract one day to get the end of the current year period
  return addDays(nextYearStart, -1);
}

/**
 * Determines which financial year a given date falls into
 * @param date The date to check
 * @param roadmapStartDate The base start date for the roadmap
 * @returns The year index (0, 1, or 2) or -1 if outside the roadmap
 */
export function getFinancialYear(date: Date, roadmapStartDate: Date): number {
  const yearOneStart = new Date(roadmapStartDate);
  const yearOneEnd = getYearEndDate(yearOneStart);
  
  const yearTwoStart = addMonths(yearOneStart, 12);
  const yearTwoEnd = getYearEndDate(yearTwoStart);
  
  const yearThreeStart = addMonths(yearOneStart, 24);
  const yearThreeEnd = getYearEndDate(yearThreeStart);

  if (date >= yearOneStart && date <= yearOneEnd) return 0; // Year 1
  if (date >= yearTwoStart && date <= yearTwoEnd) return 1; // Year 2
  if (date >= yearThreeStart && date <= yearThreeEnd) return 2; // Year 3
  return -1; // Outside the 3-year roadmap
}

/**
 * Counts active months between dates within a financial year
 * @param startDate The start date of the activity
 * @param endDate The end date of the activity
 * @param yearStartDate Start of the financial year
 * @param yearEndDate End of the financial year
 * @returns Number of active months
 */
export function getActiveMonthsInYear(
  startDate: Date,
  endDate: Date,
  yearStartDate: Date,
  yearEndDate: Date
): number {
  // Ensure dates are within the year boundaries
  const effectiveStartDate = isBefore(startDate, yearStartDate) ? yearStartDate : startDate;
  const effectiveEndDate = isAfter(endDate, yearEndDate) ? yearEndDate : endDate;
  
  // If dates don't overlap with the year, return 0
  if (isAfter(effectiveStartDate, yearEndDate) || isBefore(effectiveEndDate, yearStartDate)) {
    return 0;
  }
  
  // Calculate the difference in months and add 1 to include both start and end months
  // This ensures full month charging even for partial months
  const monthsDiff = differenceInMonths(effectiveEndDate, effectiveStartDate);
  return monthsDiff + 1;
}

/**
 * Calculate costs for an intervention in a specific financial year
 */
export function calculateYearlyCosts(
  intervention: Intervention,
  yearStart: Date,
  yearEnd: Date,
  roadmapStartDate: Date
) {
  const { timeline, costs, eligibleEmployees = 0 } = intervention;
  
  // 1. Implementation Cost (Fixed Fee)
  // Charged in the year of Implementation Start Date
  const implStartYear = getFinancialYear(timeline.implementationStartDate, roadmapStartDate);
  const currentYear = getFinancialYear(yearStart, roadmapStartDate);
  const implementationCost = implStartYear === currentYear ? costs.implementationCost : 0;
  
  // 2. Ongoing Cost (PEPM)
  // Calculate based on eligible employees and active months
  let pepmCost = 0;
  if (eligibleEmployees > 0) {
    const monthlyPEPM = costs.ongoingCostPEPM * eligibleEmployees;
    const activeMonths = getActiveMonthsInYear(
      timeline.ongoingStartDate,
      timeline.ongoingEndDate,
      yearStart,
      yearEnd
    );
    pepmCost = monthlyPEPM * activeMonths;
  }
  
  // 3. Ongoing Cost (Fixed Annual Fee)
  // Charged once per year if the intervention is active at any point in the year
  const isActiveInYear = (
    isWithinInterval(yearStart, { start: timeline.ongoingStartDate, end: timeline.ongoingEndDate }) || 
    isWithinInterval(yearEnd, { start: timeline.ongoingStartDate, end: timeline.ongoingEndDate }) ||
    (isBefore(timeline.ongoingStartDate, yearStart) && isAfter(timeline.ongoingEndDate, yearEnd))
  );
  const fixedAnnualCost = isActiveInYear ? costs.ongoingCostFixed : 0;
  
  // 4. One Time Fixed Fee
  // Charged in the year of Ongoing Start Date
  const ongoingStartYear = getFinancialYear(timeline.ongoingStartDate, roadmapStartDate);
  const oneTimeFixedFee = ongoingStartYear === currentYear ? costs.oneTimeFixedFee : 0;
  
  return {
    implementationCost,
    pepmCost,
    fixedAnnualCost,
    oneTimeFixedFee,
    total: implementationCost + pepmCost + fixedAnnualCost + oneTimeFixedFee,
  };
}

export function calculateTotalYearlyCosts(
  interventions: Intervention[],
  yearStart: Date,
  yearEnd: Date,
  roadmapStartDate: Date
) {
  return interventions.reduce(
    (total, intervention) =>
      total + calculateYearlyCosts(intervention, yearStart, yearEnd, roadmapStartDate).total,
    0
  );
} 