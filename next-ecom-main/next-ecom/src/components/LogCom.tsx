import { LoginLog } from "@prisma/client";

export default function LogCom(userloginlogs: any) {
  return (
    <div className="card-body">
      <h2 className="card-title">{userloginlogs.email}</h2>
      <h2 className="card-title">{userloginlogs.timestamp.toLocaleString()}</h2>
    </div>
  );
}
