// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import * as jwt from 'jsonwebtoken'
// import { jwtConstants, reqWhiteList } from "../../config/authConfig";
// import { UnauthorizedException } from "../exception/UnauthorizedException";
//
// @Injectable()
// export class AuthTokenInterceptor implements NestInterceptor {
//   constructor() {
//   }
//
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const token = request.headers['authorization'];
//     if (token) {
//       try {
//         const decoded = jwt.verify(token, jwtConstants.secret);
//         if (decoded) {
//           // Token is valid and not expired
//           context.switchToHttp().getRequest().body.user = decoded
//         } else {
//           // Token is invalid or expired
//           throw new UnauthorizedException()
//         }
//       } catch (e) {
//         // Token is invalid or expired
//         throw new UnauthorizedException()
//       }
//     } else if (reqWhiteList.indexOf(request.url) === -1) {
//       throw new UnauthorizedException()
//     }
//     return next.handle()
//   }
// }
