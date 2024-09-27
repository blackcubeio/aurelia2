export default `<template>
    <div class="flex p-1" >
        <div if.bind="user" class="flex-1">
            <input id="webauthn-email" type="text" placeholder="E-Mail" value.bind="email" class="block w-full rounded-md border-0 pb-1.5 my-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            <input id="webauthn-name" type="text" placeholder="Name" value.bind="name" class="block w-full rounded-md border-0 pt-1.5 my-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        <button click.trigger="onSubmitRegister($event)" type="button" class="flex-none w-10 rounded px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600" class.bind="error?'text-red-600':''">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
            </svg>
        </button>
    </div>
</template>`

