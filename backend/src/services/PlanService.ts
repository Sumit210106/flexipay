import { Types } from "mongoose";
import { MongoPlanRepository } from "../repositories/mongo/MongoPlanRepository";
import { PlanDocument } from "../models/plan.model";
import { NotFoundError, ConflictError } from "../errors/AppError";

interface CreatePlanInput {
  name: string;
  price: number;
  currency?: string;
  interval: string;
  organizationId: string;
}

interface UpdatePlanInput {
  name?: string;
  price?: number;
  currency?: string;
  interval?: string;
}

export class PlanService {
  private planRepo: MongoPlanRepository;

  constructor() {
    this.planRepo = new MongoPlanRepository();
  }

  async createPlan(input: CreatePlanInput): Promise<PlanDocument> {
    const { organizationId, ...rest } = input;
    const existing = await this.planRepo.findByNameAndOrg(input.name, organizationId);
    if (existing) {
      throw new ConflictError(`Plan "${input.name}" already exists for this organization`);
    }

    // Cast organizationId to any/Types.ObjectId to satisfy repository requirement
    return this.planRepo.create({
      ...rest,
      organizationId: new Types.ObjectId(organizationId) as any
    });
  }

  async getPlanById(id: string): Promise<PlanDocument> {
    const plan = await this.planRepo.findById(id);
    if (!plan) throw new NotFoundError("Plan");
    return plan;
  }

  async getPlansForOrg(organizationId: string): Promise<PlanDocument[]> {
    return this.planRepo.findByOrganizationId(organizationId);
  }

  async updatePlan(id: string, input: UpdatePlanInput): Promise<PlanDocument> {
    const updated = await this.planRepo.update(id, input);
    if (!updated) throw new NotFoundError("Plan");
    return updated;
  }

  async deletePlan(id: string): Promise<void> {
    const deleted = await this.planRepo.delete(id);
    if (!deleted) throw new NotFoundError("Plan");
  }
}
