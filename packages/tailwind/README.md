# Redcat Aurelia 2 tailwind toolkit

Allow easy setup of tailwind components using aurelia2

## Using it:

``` 
npm install @blackcube/aurelia2-tailwind
```
### Registering it in app

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { TailwindConfiguration } from "@blackcube/aurelia2-tailwind";
import { MyApp } from './my-app';
Aurelia
    .register(TailwindConfiguration)
    .register(LoggerConfiguration.create({
        level: LogLevel.trace,
        colorOptions: 'colors',
        sinks: [ConsoleSink]
    }))
    .app(MyApp)
    .start();


```

### `bc-tw-form-dropdown` attribute

* datasets used in main html:
  * `[data-form-dropdown="button"]` - element used to toggle dropdown
  * `[data-form-dropdown="input"]` - input element used to let user filter elements
  * `[data-form-dropdown="panel"]` - panel containing dropdown items
* datasets used in option template :
  * `[data-form-dropdown="option-button"]` - button used to select option
   
#### Example:

select element will be hidden and updated with selected value from dropdown

```html
<div bc-tw-form-dropdown="">
    <select tabindex="-1" class="hidden">
        <option value="1">1 Choice</option>
        <option value="2">2 Choice</option>
        <option value="3">3 Choice</option>
        <option value="4">4 Choice</option>
        <option value="5">5 Choice</option>
    </select>
        <label class="block text-sm font-medium leading-6 text-gray-900">Assigned to</label>
        <div class="relative mt-2">
            <input data-form-dropdown="input" type="text" class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" role="combobox" aria-controls="options" aria-expanded="false">
            <button data-form-dropdown="button" type="button" tabindex="-1" class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z" clip-rule="evenodd" />
                </svg>
            </button>

            <ul data-form-dropdown="panel" class="hidden absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" id="options" role="listbox">
                <template>
                    <!--
                      Combobox option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

                      Active: "text-white bg-indigo-600", Not Active: "text-gray-900"
                    -->
                    <li data-form-dropdown="option">
                        <button data-form-dropdown="option-button" tabindex=-1" class="w-full text-left group relative py-2 pl-8 pr-4 text-gray-900 hover:text-white hover:bg-indigo-600 cursor-pointer">
                        <!-- Selected: "font-semibold" -->
                        <span class="block truncate" data-value=""></span>
                        <!--
                          Checkmark, only display for selected option.

                          Active: "text-white", Not Active: "text-indigo-600"
                        -->
                        <span data-selected="" class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-hover:text-white">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        </button>
                    </li>
                </template>
            </ul>
        </div>
    </div>
```

### `bc-tw-menu-mobile` attribute

* datasets used in main html:
  * `[data-menu-mobile="open"]` - element used to open menu
  * `[data-menu-mobile="close"]` - element used to close menu
  * `[data-menu-mobile="overlay"]` - overlay element
  * `[data-menu-mobile="offcanvas"]` - offcanvas element

#### Example:

```html

<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
<div class="relative z-50 lg:hidden" role="dialog" aria-modal="true" bc-tw-menu-mobile="">
    <!--
      Off-canvas menu backdrop, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div class="fixed inset-0 bg-gray-900/80 opacity-0" aria-hidden="true" data-menu-mobile="overlay"></div>

    <div class="fixed inset-0 flex">
        <!--
          Off-canvas menu, show/hide based on off-canvas menu state.

          Entering: "transition ease-in-out duration-300 transform"
            From: "-translate-x-full"
            To: "translate-x-0"
          Leaving: "transition ease-in-out duration-300 transform"
            From: "translate-x-0"
            To: "-translate-x-full"
        -->
        <div class="relative mr-16 flex w-full max-w-xs flex-1 -translate-x-full" data-menu-mobile="offcanvas">
            <!--
              Close button, show/hide based on off-canvas menu state.

              Entering: "ease-in-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
              Leaving: "ease-in-out duration-300"
                From: "opacity-100"
                To: "opacity-0"
            -->
            <div class="absolute left-full top-0 flex w-16 justify-center pt-5 opacity-0">
                <button type="button" class="-m-2.5 p-2.5"  data-menu-mobile="close">
                    <span class="sr-only">Close sidebar</span>
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <!-- sidebar -->
            </div>
        </div>
    </div>
</div>
```

### `bc-tw-menu-sidebar` attribute

* datasets used in main html:
  * `[data-menu-sidebar-arrow]` - arrow showing if there is submenu and if it's open or closed
  * `[data-menu-sidebar="<value>"]` - value is the name of the menu item. The name is used to store in local storage if the menu is open or closed

#### Example:

```html
<nav class="flex flex-1 flex-col" bc-tw-menu-sidebar="">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
                <ul role="list" class="-mx-2 space-y-1">
                    <li>
                        <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" -->
                        <a href="#">
                            <svg class="h-6 w-6 shrink-0 text-indigo-600">
                                <!-- Heroicon name: outline/home -->
                            </svg>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 bg-gray-50 text-indigo-600">
                            <svg class="h-6 w-6 shrink-0 text-gray-400">
                                <!-- Heroicon name: outline/collection -->
                            </svg>
                            Team
                    </li>
                    <li>
                        <div>
                            <button type="button" class="flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50">
                                <svg class="h-6 w-6 shrink-0 text-gray-400">
                                    <!-- Heroicon name: outline/users -->
                                </svg>
                                Users
                                <!-- Expanded: "rotate-90 text-gray-500", Collapsed: "text-gray-400" -->
                                <svg class="ml-auto h-5 w-5 shrink-0 text-gray-400" data-menu-sidebar-arrow="">
                                    <!-- Heroicon name: outline/chevron-right -->
                                </svg>
                            </button>
                            
                            <!-- Expandable link section, show/hide based on state. -->
                            <ul class="mt-1 px-2 hidden" id="sub-menu-users">
                                <li>
                                    <!-- 44px -->
                                    <a href="#" class="block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700 hover:bg-gray-50">
                                        Teachers
                                    </a>
                                </li>
                                <li>
                                    <!-- 44px -->
                                    <a href="#" class="block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700 hover:bg-gray-50">
                                        Students
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </li>
            <!-- stuff for sidebar -->
        </ul>
    </nav>
```