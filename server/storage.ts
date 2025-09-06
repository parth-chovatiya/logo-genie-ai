import { type LogoRequest, type InsertLogoRequest, type GeneratedLogo } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createLogoRequest(request: InsertLogoRequest): Promise<LogoRequest>;
  getLogoRequest(id: string): Promise<LogoRequest | undefined>;
  updateLogoRequestWithResults(id: string, logos: GeneratedLogo[]): Promise<LogoRequest | undefined>;
}

export class MemStorage implements IStorage {
  private logoRequests: Map<string, LogoRequest>;

  constructor() {
    this.logoRequests = new Map();
  }

  async createLogoRequest(insertRequest: InsertLogoRequest): Promise<LogoRequest> {
    const id = randomUUID();
    const request: LogoRequest = {
      ...insertRequest,
      id,
      colorPreference: insertRequest.colorPreference || null,
      generatedLogos: null,
      createdAt: new Date(),
    };
    this.logoRequests.set(id, request);
    return request;
  }

  async getLogoRequest(id: string): Promise<LogoRequest | undefined> {
    return this.logoRequests.get(id);
  }

  async updateLogoRequestWithResults(id: string, logos: GeneratedLogo[]): Promise<LogoRequest | undefined> {
    const request = this.logoRequests.get(id);
    if (request) {
      const updatedRequest = { ...request, generatedLogos: logos };
      this.logoRequests.set(id, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
