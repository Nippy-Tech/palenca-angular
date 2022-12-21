import { Component } from '@angular/core';
import { OnEvent } from './palenca/enums';
import { loadLink } from './palenca/load';
import { RenderOptions } from './palenca/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'test-pal';
  public renderConfig: RenderOptions = {
    configuration: {
      hideConsent: true,
      country: 'ar',
      redirectUrl: 'https://www.google.com.mx',
    },
    appearance: {
      primaryColor: '#ea4c89',
      borderRadius: '9999px',
    },
  };
  private publicApiKey = 'public_c73e_4b01_8bc3_856375c41518';
  private widgetId = '1498e5cd-f847-406a-9e69-ff273101b19d';

  ngOnInit() {
    loadLink(this.publicApiKey, this.widgetId).then((link) => {
      link.on(OnEvent.ready, () => {
        console.log('Widget is ready');
      });

      link.on(OnEvent.user_created, (event) => {
        console.log('User created', event);
      });

      link.on(OnEvent.connection_success, (event) => {
        console.log(
          `Connection success for userId ${event.data.user_id} and accountId ${event.data.account_id}`
        );
      });

      link.on(OnEvent.connection_error, (event) => {
        console.log(`Connection error ${event.data.error.code}`);
      });

      link.render('container', this.renderConfig);

      window.addEventListener('unload', () => {
        link.destroy();
      });
    });
  }
}
