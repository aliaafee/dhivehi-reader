import os.path
from pathlib import Path
import soundfile

def get_female_tts_model(load=True):
    if not load: #Dont load model to speed up testing
        import numpy as np
        return lambda t,speed : np.array([])
        
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


def tts_soundfile(text, tts_model, out_filename, speed=0.95):
    output_wav = tts_model(text, speed=speed)

    if len(output_wav) == 0:
        return False

    soundfile.write(
        out_filename,
        output_wav.astype('int16'),
        22050,
        'PCM_16'
    )

    return True