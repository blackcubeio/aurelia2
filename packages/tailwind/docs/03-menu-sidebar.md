# Sidebar

Allow easy management of sidebar in menu (tailwindui) using aurelia2

## `bc-tw-menu-sidebar` attribute

### HTML datasets

* `[data-menu-sidebar-arrow]` - arrow showing if there is submenu and if it's open or closed
* `[data-menu-sidebar="<value>"]` - value is the name of the menu item. The name is used to store in local storage if the menu is open or closed

### Example:

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