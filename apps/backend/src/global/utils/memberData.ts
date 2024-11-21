import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Optional } from './dataCustomType';

export const User = createParamDecorator((data: Optional<string>, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return data ? user?.[data] : user;
});
