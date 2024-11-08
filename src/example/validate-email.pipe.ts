import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'isEmailValid',
    standalone: true
})
export class ValidateEmailPipe implements PipeTransform {
    transform(value: string | string[]): boolean {
        const regexForEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return regexForEmail.test(typeof value === 'object' ? value[0].trim() : value.trim());
    }
}