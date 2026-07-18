import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * SharedModule — módulo con imports reutilizables en features.
 * En componentes standalone, importar directamente lo que se necesite.
 * Este módulo sirve de referencia centralizada.
 */
@NgModule({
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule {}
