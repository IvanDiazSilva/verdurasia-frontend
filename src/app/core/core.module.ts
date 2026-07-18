import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CoreModule — importar solo una vez en AppModule (o equivalente standalone).
 * Contiene servicios singleton, interceptores y guards globales.
 * En arquitectura standalone Angular 17+, la mayoría se registra en app.config.ts.
 */
@NgModule({
  imports: [CommonModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule ya está cargado. Importar solo en el módulo raíz.');
    }
  }
}
