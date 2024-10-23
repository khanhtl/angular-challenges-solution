import { Directive, input } from '@angular/core';

@Directive({ selector: 'ng-template[typedTemplate]', standalone: true })
export class TypedTemplateDirective<TypeToken> {
  typedTemplate = input.required<TypeToken>();
  static ngTemplateContextGuard<TypeToken>(
    dir: TypedTemplateDirective<TypeToken>,
    ctx: unknown,
  ): ctx is TypeToken {
    return true;
  }
}
