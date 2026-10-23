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
      # Nur Node (README: >= 18); npm ist in nodejs enthalten.
      # Den AssemblyScript-Compiler (asc) holt npm nach node_modules.
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_24
        ];
      };
    };
}
