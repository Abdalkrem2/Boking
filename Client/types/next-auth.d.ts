import nextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      address1: string;
      address2: string;
      location: string;
      location_id: number;
      role: number;
      token: string;
      location_link: string;
    };
  }
}
