export interface Schema {
  space_id: string;
  environment: string;
  delivery_accessToken: string;
  project?: string;
  name?: string;
  path?: string;
  module?: any;
}