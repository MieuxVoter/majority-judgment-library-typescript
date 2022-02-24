export function gcd(a: bigint, b: bigint): bigint {
    return b == 0n ? a : gcd(b, a % b);
}

export function lcm(a: bigint, b: bigint): bigint {
    return (a * b) / gcd(a, b);
}
