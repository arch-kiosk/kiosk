import os

def get_file_extension(filename):
    ext = ""
    try:
        new_filename, ext = os.path.splitext(filename)
        if ext[0] == ".":
            ext = ext[1:]
    except:
        pass
    return ext
