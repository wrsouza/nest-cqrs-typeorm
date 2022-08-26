import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Not } from 'typeorm';
import { UsersRepository } from '../repositories/users.repository';
import { BaseRequest } from '../requests/base.request';

@ValidatorConstraint({ name: 'uniqueEmail', async: true })
@Injectable()
export class UniqueEmailValidation implements ValidatorConstraintInterface {
  constructor(private repository: UsersRepository) {}

  async validate(email: string, args: ValidationArguments) {
    try {
      const where = { email };
      const { context } = args.object as BaseRequest;
      if (context.params.id) {
        where['id'] = Not(context.params.id);
      }
      const user = await this.repository.findOneBy(where);
      return !user;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  defaultMessage() {
    return `Email already exists.`;
  }
}

export function UniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueEmailValidation,
    });
  };
}
