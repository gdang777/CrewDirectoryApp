import { Injectable, BadRequestException } from '@nestjs/common';
import { Pairing, CrewMember } from './entities';
const ICAL = require('ical.js'); // Use require for ical.js as it often has issues with ESM/TS imports

@Injectable()
export class ICSParserService {
  async parseICS(icsData: string, userId: string): Promise<Partial<Pairing>> {
    try {
      const jcalData = ICAL.parse(icsData);
      const comp = new ICAL.Component(jcalData);
      const vevent = comp.getFirstSubcomponent('vevent');

      if (!vevent) {
        throw new BadRequestException('No event found in ICS data');
      }

      const event = new ICAL.Event(vevent);

      // Extract basic info
      return {
        startDate: event.startDate.toJSDate(),
        endDate: event.endDate.toJSDate(),
        airline: event.summary, // Mapping summary to airline for MVP
        // In a real app more extraction logic needed
      };
    } catch (error) {
      console.error('ICS Parse Error', error);
      throw new BadRequestException('Invalid ICS file format');
    }
  }

  async extractCrewMembers(icsData: string): Promise<CrewMember[]> {
    // Basic extraction placeholder
    return [];
  }
}
