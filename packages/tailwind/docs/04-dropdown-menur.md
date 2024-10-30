# Dropdown Menu

Allow easy management of dropdown menu (tailwindui) using aurelia2

## `bc-tw-dropdown-menu` attribute

### HTML datasets

* `[data-dropdown-menu="button"]` - button to open the dropdown menu
* `[data-dropdown-menu="menu"]` - dropdown menu panel

### Example:

```html
<div class="relative flex-none" bc-tw-dropdown-menu="">
    <button data-dropdown-menu="button" type="button" class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900" id="options-menu-button" aria-expanded="false" aria-haspopup="true">
        <span class="sr-only">
            Options
        </span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
        </svg>
    </button>

    <!--
      Dropdown menu, show/hide based on menu state.

      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    -->
    <div data-dropdown-menu="menu" style="display:none" class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button" tabindex="-1">
        <!-- Active: "bg-gray-50", Not Active: "" -->
        <a href="#" class="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50" role="menuitem" tabindex="-1"
           Edit
        </a>
        <a href="#" class="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50" role="menuitem" tabindex="-1"
           Delete
        </a>
    </div>
</div>
```