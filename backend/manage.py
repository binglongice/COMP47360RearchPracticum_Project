#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

# Django management script

def main():
    """Run administrative tasks."""

    #locate the project's settings
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yelp_integration.settings")

    #try-except block 
    #If there's an ImportError we offer an informative error message

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


#The main() function is called if the script is executed
if __name__ == "__main__":
    main()
