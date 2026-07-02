# FaceOnLive — ID Recognition SDK for Linux

Server-side ID document recognition (OCR, MRZ, barcode, and credit-card reading) for Linux, exposed through a Python interface with ready-to-run **Flask** and **Gradio** demos.

> Part of the [FaceOnLive](https://faceonlive.com) on-premises biometric SDK suite.

## Features
- OCR + MRZ parsing for passports, ID cards, and driver's licenses.
- Credit-card and barcode reading.
- On-premises and offline; REST (Flask) and web-UI (Gradio) demos included.

## Requirements
| | |
|---|---|
| OS | Linux x86-64 |
| Runtime | Python 3.8+ |
| Engine | native OCR engine (included under `engine/`) |

## Setup
1. Get a license key — free trial at **https://faceonlive.com**.
2. Provide the key via the `LICENSE_KEY` environment variable, or `license.txt` (replace the `<YOUR_LICENSE_KEY>` placeholder).
3. Install requirements, then run a demo:
   ```bash
   python flask/app.py      # REST API
   python gradio/app.py     # web UI
   ```

## Quick start (Python)
```python
from engine.header import *

set_activation(license_key.encode("utf-8"))   # TTVOcrSetActivation
init_sdk()                                     # TTVOcrInit
result = ocr_id_card(image)                    # TTVOcrProcess → JSON
```

## API reference (Python bindings → native)
| Binding | Native | Description |
|---|---|---|
| `get_deviceid()` | `TTVOcrGetHWID` | Machine hardware ID (for offline licensing). |
| `set_activation(key)` | `TTVOcrSetActivation` | Activate the SDK. |
| `init_sdk()` | `TTVOcrInit` | Initialize the engine. |
| `ocr_id_card(image)` | `TTVOcrProcess` | Recognize an ID document → JSON. |
| `ocr_credit_card(image)` | `TTVOcrCreditCard` | Read a credit/debit card. |
| `ocr_barcode(image)` | `TTVOcrBarCode` | Read a barcode / QR code. |

## License & support
Requires a valid license key — get one at **[faceonlive.com](https://faceonlive.com)**. Keep `license.txt` out of version control. Questions: contact@faceonlive.com

## 📦 Full SDK download
This repository contains the source/demo code only. Download the complete SDK — engine libraries and models, with full project structure — from the [Releases](../../releases) page and extract it over this project.
