import { GenericClassDecorator, Type } from './type';


export const Injectable = (): GenericClassDecorator<Type<object>> => {
  return (target: Type<object>) => { };
};
