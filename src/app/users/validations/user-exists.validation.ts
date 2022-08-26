import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepository } from '../repositories/users.repository';

@ValidatorConstraint({ name: 'userExists', async: true })
@Injectable()
export class UserExistsValidation implements ValidatorConstraintInterface {
  constructor(private repository: UsersRepository) {}

  async validate(id: string) {
    try {
      const user = await this.repository.findOneBy({ id });
      return !!user;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  defaultMessage() {
    return `User not exists.`;
  }
}

export function UserExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserExistsValidation,
    });
  };
}
