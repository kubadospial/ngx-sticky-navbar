import { SpacerTypes } from "./spacer-types.enum";
import { ElementRef } from "@angular/core";

export interface Settings {
    spacer?: {
        element?: ElementRef,
        autoHeight?: boolean,
        height?: number,
        type?: SpacerTypes
    },
    sensitivity?: {
        top?: number | string,
        bottom?: number | string
    },
    scroll?: {
        element?: string,
        offset?: {
            top?: number,
            autoTop?: boolean
        }
    }
}
