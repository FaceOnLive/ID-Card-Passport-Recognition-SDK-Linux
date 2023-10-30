import ctypes, ctypes.util
from ctypes import *
from numpy.ctypeslib import ndpointer
import sys
import os

dll_path = os.path.abspath(os.path.dirname(__file__)) + '/libttvocrengine.so'
ocr_engine = cdll.LoadLibrary(dll_path)

TTVOcrInit = ocr_engine.TTVOcrInit
TTVOcrInit.argtypes = [ctypes.c_char_p]
TTVOcrInit.restype = ctypes.c_char_p

TTVOcrProcess = ocr_engine.TTVOcrProcess
TTVOcrProcess.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
TTVOcrProcess.restype = ctypes.c_char_p

TTVOcrCreditCard = ocr_engine.TTVOcrCreditCard
TTVOcrCreditCard.argtypes = [ctypes.c_char_p]
TTVOcrCreditCard.restype = ctypes.c_char_p

TTVOcrBarCode = ocr_engine.TTVOcrBarCode
TTVOcrBarCode.argtypes = [ctypes.c_char_p]
TTVOcrBarCode.restype = ctypes.c_char_p

TTVOcrGetHWID = ocr_engine.TTVOcrGetHWID
TTVOcrGetHWID.argtypes = []
TTVOcrGetHWID.restype = ctypes.c_char_p

TTVOcrSetActivation = ocr_engine.TTVOcrSetActivation
TTVOcrSetActivation.argtypes = []
TTVOcrSetActivation.restype = ctypes.c_char_p

dll_path = os.path.abspath(os.path.dirname(__file__)) + '/libttvifchecker.so'
if_engine = cdll.LoadLibrary(dll_path)

ttv_if_checker = if_engine.ttv_if_checker
ttv_if_checker.argtypes = [ctypes.c_char_p]
ttv_if_checker.restype = ctypes.c_int32
