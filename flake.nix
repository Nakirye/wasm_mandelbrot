{
  description = "Mandelbrot: JavaScript vs. WebAssembly - Dev-Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      # Only Node (README: >= 18); npm is included in nodejs.
      # npm fetches the AssemblyScript compiler (asc) into node_modules.
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_24
        ];
      };
    };
}
