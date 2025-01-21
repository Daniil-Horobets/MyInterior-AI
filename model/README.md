# ControlNet 1.1 as Cog

Implementation of [ControlNet 1.1](https://github.com/lllyasviel/ControlNet-v1-1-nightly) as a Cog model. [Cog](https://github.com/replicate/cog) packages machine learning models into standard containers.

## Usage (Locally)

1. Install [Cog](https://github.com/replicate/cog).

2. Download the pre-trained weights using the [download_weights script](./script/download_weights).

3. Run predictions:

   ```bash
   cog predict -i image=@test.png -i prompt="test" -i structure="scribble"
   ```
