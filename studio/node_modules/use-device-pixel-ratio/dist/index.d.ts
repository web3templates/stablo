export interface DevicePixelRatioOptions {
    /**
     * Default DPR to use if browser does not support the `devicePixelRatio`
     * property, or when rendering on server
     *
     * @defaultValue `1`
     */
    defaultDpr?: number;
    /**
     * Whether or not to round the number down to the closest integer
     *
     * @defaultValue `true`
     */
    round?: boolean;
    /**
     * Maximum DPR to return (set to `2` to only generate 1 and 2)
     *
     * @defaultValue `3`
     */
    maxDpr?: number;
}
/**
 * Get the device pixel ratio, potentially rounded and capped.
 * Will emit new values if it changes.
 *
 * @param options
 * @returns The current device pixel ratio, or the default if none can be resolved
 */
export declare function useDevicePixelRatio(options?: DevicePixelRatioOptions): number;
/**
 * Returns the current device pixel ratio (DPR) given the passed options
 *
 * @param options
 * @returns current device pixel ratio
 */
export declare function getDevicePixelRatio(options?: DevicePixelRatioOptions): number;
