import { PlanModel, PlanDocument } from "../../models/plan.model";
import { IPlanRepository } from "../interfaces/IPlanRepository";

export class MongoPlanRepository implements IPlanRepository {
  async findById(id: string): Promise<PlanDocument | null> {
    return PlanModel.findById(id);
  }

  async create(data: Partial<PlanDocument>): Promise<PlanDocument> {
    return PlanModel.create(data);
  }

  async update(id: string, data: Partial<PlanDocument>): Promise<PlanDocument | null> {
    return PlanModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await PlanModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findByOrganizationId(organizationId: string): Promise<PlanDocument[]> {
    return PlanModel.find({ organizationId });
  }

  async findByNameAndOrg(name: string, organizationId: string): Promise<PlanDocument | null> {
    return PlanModel.findOne({ name, organizationId });
  }
}
