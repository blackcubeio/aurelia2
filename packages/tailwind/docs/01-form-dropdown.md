# Form Dropdown

Allow easy management of dropdown (tailwindui) in forms (`select` element) using aurelia2

## `bc-tw-form-dropdown` attribute

This attribute needs a template which will be duplicated for each option in the dropdown. The template should contain a button with the dataset `data-form-dropdown="option-button"` and an element with the dataset `data-value` which will be used to set the value of the option.

### HTML datasets

* In main html:
    * `[data-form-dropdown="button"]` - element used to toggle dropdown
    * `[data-form-dropdown="input"]` - input element used to let the user filter elements
    * `[data-form-dropdown="panel"]` - panel containing dropdown items
* In option template :
    * `[data-form-dropdown="option-button"]` - button used to (un)select option - unselect is only available if `select` is `multiple`

### Example:

select element will be hidden and updated with selected value from dropdown

```html
<div bc-tw-form-dropdown="">
    <select tabindex="-1" class="hidden">
        <option value="1">Choice 1</option>
        <option value="2">Choice 2</option>
        <option value="3">Choice 3</option>
        <option value="4">Choice 4</option>
        <option value="5">Choice 5</option>
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

                    -->
                    <li data-form-dropdown="option">
                        <button data-form-dropdown="option-button" tabindex=-1" class="w-full text-left group relative py-2 pl-8 pr-4 text-gray-900 hover:text-white hover:bg-indigo-600 cursor-pointer">
                        <!-- Selected: "font-semibold" -->
                        <span class="block truncate" data-value=""></span>
                        <!--
                          Checkmark, only display for selected option.
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
