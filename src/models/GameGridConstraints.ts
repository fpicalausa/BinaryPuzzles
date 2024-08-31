import { checkState, ErrorType } from './GameConstraintChecker.ts';
import { GridState } from './GridState.ts';

export class GameGridConstraints {
    private boundaries: [CellLocation, CellLocation];
    private state: GridState;

    constructor(
        state: GridState,
        topLeft: CellLocation,
        bottomRight: CellLocation,
    ) {
        this.state = state;
        this.boundaries = [topLeft, bottomRight];
    }

    getBoundaries(): [CellLocation, CellLocation] {
        return this.boundaries;
    }
    checkState(): {
        isComplete: boolean;
        isValid: boolean;
        errors: ErrorType[];
    } {
        const slice = this.state.getSlice(
            this.boundaries[0],
            this.boundaries[1],
        );

        const result = checkState(slice);
        return {
            isComplete: result.isComplete,
            isValid: result.isValid,
            errors: result.errors.map((e) => ({
                error: e.error,
                location: [
                    e.location[0] + this.boundaries[0][0],
                    e.location[1] + this.boundaries[0][1],
                ],
            })),
        };
    }
}
