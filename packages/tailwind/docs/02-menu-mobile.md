# Mobile menu

Allow easy management of mobile menu (tailwindui) using aurelia2

## `bc-tw-menu-mobile` attribute

### HTML datasets

* `[data-menu-mobile="open"]` - element used to open menu
* `[data-menu-mobile="close"]` - element used to close menu
* `[data-menu-mobile="overlay"]` - overlay element
* `[data-menu-mobile="offcanvas"]` - offcanvas element

### Example:

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
