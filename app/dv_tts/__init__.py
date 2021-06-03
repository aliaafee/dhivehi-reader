import os.path
from pathlib import Path

def get_female_tts_model():
    from .tts import TTSModel

    tts_model_path = Path(os.path.realpath(__file__)).parents[0] / 'models'
    
    tts_female_path = tts_model_path / "female" / "dv_female.v1" / "Female Aisha"

    print("Loading Female TTS Model...")
    model = TTSModel(
        str(tts_female_path / "tts.saved_model"),
        str(tts_female_path / "vocoder.saved_model")
    )
    print("Done")

    return model