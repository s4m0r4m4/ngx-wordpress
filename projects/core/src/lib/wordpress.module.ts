import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CachingInterceptor } from './cache/cache.interceptor';
import { RequestCache, RequestCacheWithMap } from './cache/cache.service';
import { WpConfig, WP_CONFIG } from './interfaces/wp-config.interface';
// Avoid circular dependency error by NOT using barrel imports.
import { JwtInterceptor } from './jwt/jwt.interceptor';
import { WordPress } from './wordpress.service';


@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class WordPressModule {

  constructor(@Optional() @SkipSelf() parentModule: WordPressModule, wp: WordPress) {
    if (parentModule) {
      throw new Error('WordPressModule is already loaded. It should only be imported in your application\'s main module.');
    }
  }

  static forRoot(config?: WpConfig): ModuleWithProviders<WordPressModule> {
    return {
      ngModule: WordPressModule,
      providers: [
        {provide: WP_CONFIG, useValue: config},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: RequestCache, useClass: RequestCacheWithMap},
        {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true}
      ]
    };
  }
}
