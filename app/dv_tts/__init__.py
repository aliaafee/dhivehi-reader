import os.path
from pathlib import Path
import soundfile
from io import BytesIO
import base64


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


def tts_stream(text, tts_model, speed=0.95):
    output_wav = tts_model(text, speed=speed)

    audio_data = BytesIO()

    soundfile.write(
        audio_data,
        output_wav.astype('int16'),
        22050,
        subtype='PCM_16',
        format="WAV"
    )
    
    audio_data.seek(0)

    return audio_data.read()


def tts_base64wav(text, tts_model, speed=0.95):
    audio_file = tts_stream(text, tts_model, speed)

    return "data:audio/wav;base64," + base64.standard_b64encode(audio_file).decode()
