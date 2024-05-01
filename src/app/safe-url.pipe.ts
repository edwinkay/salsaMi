import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string, additionalParams: string = ''): SafeResourceUrl {
    let fullUrl = url;
    // Verifica si hay parámetros adicionales y si la URL es de YouTube
    if (additionalParams && url.includes('youtube.com')) {
      // Si hay parámetros adicionales y es una URL de YouTube, agrega los parámetros al final de la URL
      fullUrl += (url.includes('?') ? '&' : '?') + additionalParams;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }
}
