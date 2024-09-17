import { IPageRequest, IPagedResponse } from "./pagination";

export interface IRepository<
  MutationModel,
  CompleteModel extends Partial<MutationModel>
> {
  create(data: MutationModel): Promise<CompleteModel | undefined>;
  update(
    id: number,
    data: Partial<MutationModel>
  ): Promise<CompleteModel | undefined>;
  delete(id: number): Promise<CompleteModel | undefined>;
  getById(id: number): Promise<CompleteModel | CompleteModel[] | undefined>;
  list(
    params: IPageRequest
  ): Promise<IPagedResponse<Partial<CompleteModel>> | null | undefined>;
}
