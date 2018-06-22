from picamera import PiCamera
from time import sleep

camera = PiCamera()

camera.resolution = (600,900)
# camera.rotation = 90
# camera.start_preview()
print ('starting pi record')
camera.start_recording('./raw/video.h264')
sleep(5)
camera.stop_recording()
print ('record over')
# camera.stop_preview()
