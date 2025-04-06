﻿namespace BikeBuddy.Domain.Shared;

// Перенести в проект BikeBuddy.Shared
public class Constants
{
    public const int LOW_TEXT_LENGTH = 100;

    public const int HIGH_TEXT_LENGTH = 800;

    public const int MIN_LOW_TEXT_LENGTH = 20;

    public const int MIDDLE_LOW_TEXT_LENGTH = 50;
}

public static class Files
{
    public class FileNameConstants
    {
        public const string MAP_IMAGE_FILENAME = "map.png";
    }

    public class BucketNameConstants
    {
        public const string EVENT_IMAGES = "event-images";
    }
}