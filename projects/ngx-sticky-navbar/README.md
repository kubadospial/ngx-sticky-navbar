# ngx-sticky-navbar
ngx-sticky-navbar is an Angular 6+ component that wrapps your navigation and it has some cool features.

##### Navbar's Sensitivity
You can set sensitivity of scroll speed when to show/hide navbar. Example of sensitivity configuration:
```ts
settings: Settings = {
  sensitivity: {
    top: DefinedSensitivity.veryLow,
    bottom: DefinedSensitivity.veryHigh
  }
};
```
To setup sensitivitity You can use defined sensitivities ([more details](https://github.com/kubadospial/ngx-sticky-navbar#Defined-Sensitivity)) or just pass a number. Greater number lowers sensitivity (0 = high sensitivity, 100 = low sensitivity).

##### Navbar's Offset Top
Everytime user scroll back to the top, the navbar becomes visible. You can configure the top offset when it should appear. There two ways:
1. Setup offset top manually
```ts
settings: Settings = {
  scroll: {
    offset: {
      top: 300 // default is 300
    }
  }
};
```
2. Setup offset top automatically. It will set *top* property automatically and dynamically to height of navbar element.
```ts
settings: Settings = {
  scroll: {
    offset: {
      autoTop: true // default is false
    }
  }
};
```

##### Navbar's Spacer
As ngx-sticky-navbar uses CSS *position:fixed*, so element wrapped by this component doesn't affect DOM height. You can compensate it by creating Spacer with height manually or automatically set at selected DOM element. To create Spacer You need three properties: height or autoHeight, Type, Element ([more details](https://github.com/kubadospial/ngx-sticky-navbar#Settings)).
1. Manual height of Spacer:
```ts
ngAfterViewInit() {
    this.settings = {
      ...this.settings,
        height: 300,
        type: SpacerTypes.PADDING,
        element: this.spacerElement,
      }
    };
    this.navbarService.mergeSettingObject(this.settings);
  }
```
2. Automatic height of Spacer:
```ts
ngAfterViewInit() {
    this.settings = {
      ...this.settings,
      spacer: {
        autoHeight: true,
        type: SpacerTypes.PADDING,
        element: this.spacerElement,
      }
    };
    this.navbarService.mergeSettingObject(this.settings);
  }
```

##### Navbar's Configuration
1. Pass settings object via property binding (required usage) [link](https://github.com/kubadospial/ngx-sticky-navbar#HTML)
2. Dynamically updating global variable settings object [link](https://github.com/kubadospial/ngx-sticky-navbar#Dynamically-Update-Settings)

## Note
```
Component requires Angular and Rxjs version >= 6.0.0.
```

## Demo
Check the [link](https://kubadospial.github.io/ngx-sticky-navbar/)

## Usage

###### Install ngx-sticky-navbar
- npm: ``` $ npm install ngx-sticky-navbar ``` 
- yarn: ``` $ yarn add ngx-sticky-navbar ``` 

###### import NgxStickyNavbarModule

```ts
import { NgxStickyNavbarModule } from 'ngx-sticky-navbar';

@NgModule({
  declarations: [...],
  imports: [
    ...
    NgxStickyNavbarModule
  ],
  providers: []
})
```

###### Use ngx-sticky-navbar
```ts
import { 
  Settings, 
  DefinedSensitivity
} from 'ngx-sticky-navbar';

@Component(...)
export class SomeComponent {
  ...
  settings: Settings = {
    scroll: {
      element: '.scrollable'
    },
    sensitivity: {
      top: DefinedSensitivity.veryLow, // or 50
      bottom: DefinedSensitivity.veryHigh // or 10
    }
  };

```
##### Use Spacer (example extends example above)
```ts
import { 
  ...
  SpacerTypes,
  NgxStickyNavbarService 
} from 'ngx-sticky-navbar';

@Component(...)
export class SomeComponent {
  @ViewChild('spacerElement') spacerElement: ElementRef;
  ...
  constructor(private navbarService: NgxStickyNavbarService) {...}

  ngAfterViewInit() {
    this.settings = {
      ...this.settings,
      // Auto Height
      spacer: {
        autoHeight: true,
        type: SpacerTypes.PADDING,
        element: this.spacerElement,
      }
      // Manual Height
      spacer: {
        height: 300,
        type: SpacerTypes.PADDING,
        element: this.spacerElement,
      }
    };
    this.navbarService.mergeSettingObject(this.settings);
  }
}

```
##### HTML
```html
<ngx-sticky-navbar [settings]="settings">
  <div class="nav"> ... </div>
</ngx-sticky-navbar>

<div class="scrollable">
  <div class="scrollable__big-element">
  </div>
</div>
```

##### Spacer HTML
```html
...
<div class="scrollable">
  <div class="scrollable__big-element"
       #spacerElement> <!-- Place where You wanna add Spacer -->
  </div>
</div>
```

## Enums / Models
#### Settings
```ts
interface Settings {
    spacer: {
        element: ElementRef; // default undefined
        autoHeight: boolean; // default false
        height: number; // default 0
        type: SpacerTypes;  // default undefined
    };
    sensitivity: {
        top: number | string; // 50 = DefinedSensitivity.veryLow
        bottom: number | string; // 10 = DefinedSensitivity.veryHigh
    };
    scroll: {
        element: string; // default <body></body>
        offset: {
            top: number; // default 300
            autoTop: boolean; // default false
        };
    };
}

```
#### Defined Sensitivity
```ts
enum DefinedSensitivity {
    Locked = 10000,
    veryLow = 50,
    Low = 40,
    Medium = 30,
    High = 20,
    veryHigh = 10
}
```
#### Navbar State
```ts
enum NavbarState {
    SHOW = 'show',
    HIDE = 'hide'
}
```
#### Spacer Types
```ts
enum SpacerTypes {
    MARGIN = 'margin-top',
    PADDING = 'padding-top'
}
```
## Service
```ts
public initialSettings: Settings // default initial settings;
public settings: Settings // global settings used by all elements of component

//  NgxStickyNavbarService.settings = global settings
//  Method sets global settings but without triggering Subject<Settings>.
//  Used only to change global settings variable.
setGlobalSettings(settings: Settings): void

//  Method uses setGlobalSettings() and triggers Subject<Settings>
//  to update global settings state in every
//  component's element (service/directibe/component).
mergeSettingObject(settings: Settings): void
```

#### Dynamically Update Settings:

```ts
import { NgxStickyNavbarService } from 'ngx-sticky-navbar';

@Component(...)
export class SomeComponent {

  settings: Settings = { ... }

  constructor(private navbarService: NgxStickyNavbarService) { }

  someMethod(settings: Settings) {
    this.settings = {
      ...this.settings,
      sensitivity: { 
        top: settings.sensitivity.top,
        bottom: settings.sensitivity.bottom
        // or use ...settings.sensitivity
      }
    };
    this.navbarService.mergeSettingObject(this.settings);
  }
}

```

or reasign initialSettings

## Contributing

1. Fork repo.
2. `npm install / yarn`.
3. Make your changes.
4. Add your tests.
5. `npm run test / yarn start test`.
6. `npm run build / yarn start build`.
7. After all tests are passing. 
8. Commit, push, PR.

## License

Released under the terms of MIT License.
