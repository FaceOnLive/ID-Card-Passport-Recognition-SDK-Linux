import os
import sys
import numpy as np
import ctypes, ctypes.util
from enum import Enum
from ctypes import *
from numpy.ctypeslib import ndpointer

def print_log(fmt): print("[LOG] \033[98m{}\033[00m" .format(fmt))
def print_info(fmt): print("[INFO] \033[92m{}\033[00m" .format(fmt))
def print_error(fmt): print("[ERR] \033[91m{}\033[00m" .format(fmt)) 
def print_warning(fmt): print("[WARNING] \033[93m{}\033[00m" .format(fmt))


ocr_path = os.path.abspath(os.path.dirname(__file__)) + '/libOCR.so'
ocr_engine = cdll.LoadLibrary(ocr_path)

get_deviceid = ocr_engine.TTVOcrGetHWID
get_deviceid.argtypes = []
get_deviceid.restype = ctypes.c_char_p

set_activation = ocr_engine.TTVOcrSetActivation
set_activation.argtypes = []
set_activation.restype = ctypes.c_char_p

init_sdk = ocr_engine.TTVOcrInit
init_sdk.argtypes = [ctypes.c_char_p]
init_sdk.restype = ctypes.c_char_p

ocr_id_card = ocr_engine.TTVOcrProcess
ocr_id_card.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
ocr_id_card.restype = ctypes.c_char_p

ocr_credit_card = ocr_engine.TTVOcrCreditCard
ocr_credit_card.argtypes = [ctypes.c_char_p]
ocr_credit_card.restype = ctypes.c_char_p

ocr_barcode = ocr_engine.TTVOcrBarCode
ocr_barcode.argtypes = [ctypes.c_char_p]
ocr_barcode.restype = ctypes.c_char_p

metacheck_path = os.path.abspath(os.path.dirname(__file__)) + '/libMetaChecker.so'
meta_engine = cdll.LoadLibrary(metacheck_path)

check_meta = meta_engine.ttv_if_checker
check_meta.argtypes = [ctypes.c_char_p]
check_meta.restype = ctypes.c_int32
