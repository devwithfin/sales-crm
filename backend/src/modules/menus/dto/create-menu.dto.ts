export class CreateMenuDto {
  menuName: string;
  menuOrder: number;
  menuLevel: number;
  menuIcon?: string | null;
  menuLink?: string | null;
  modelName?: string | null;
  permissionName?: string | null;
  parentId?: string | null;
}
