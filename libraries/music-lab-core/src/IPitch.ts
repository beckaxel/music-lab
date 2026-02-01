import { ITemperament } from "./ITemperament";
import { Note } from "./Note";

/**
 * A Pitch
 * @public
 */
export interface IPitch {
    note: Note
    deviation: number
    frequency: number
    temperament: ITemperament
}