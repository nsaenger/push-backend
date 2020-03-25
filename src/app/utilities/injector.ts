import 'reflect-metadata';
import { Type } from './type';


export const Injector = new class {
  instances: { type: Type<any>, instance: any }[] = [];

  public Resolve<T>(target: Type<any>): T {
    let tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    let injections = tokens.map((token: any) => Injector.Resolve<any>(token));

    const instance = this.instances.find(entry => entry.type === target);

    if (instance) {
      return instance.instance;
    } else {
      const newInstance = {
        type: target,
        instance: new target(...injections),
      };

      this.instances.push(newInstance);

      return newInstance.instance;
    }
  }

  public Inject<T>(target: Type<any>): T {
    const instanceObject = this.instances.find(entry => entry.type === target);
    return instanceObject ? instanceObject.instance : null;
  }

  public Destroy() {
    Injector.All()
      .map(instance => {
        if (typeof (instance.onDestroy) === 'function') {
          instance.onDestroy();
        }
      });
    Injector.instances = [];
  }

  public All() {
    return this.instances.filter(i => i !== undefined && i.instance !== undefined).map(i => i.instance);
  }
};
