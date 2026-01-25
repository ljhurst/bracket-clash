interface OverrideManifest {
    [gender: string]:
        | {
              [year: string]: boolean | undefined;
          }
        | undefined;
}

export { OverrideManifest };
