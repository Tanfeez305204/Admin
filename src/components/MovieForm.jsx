import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ThumbnailUpload from "./ThumbnailUpload";

const movieSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters."),
  language: z.enum(
    ["Hindi Dubbed", "South Dubbed", "English", "Bollywood", "Multi Audio"],
    {
      errorMap: () => ({ message: "Please select a valid language." })
    }
  ),
  year: z.coerce
    .number({ invalid_type_error: "Year is required." })
    .min(1900, "Year must be at least 1900.")
    .max(2030, "Year must be at most 2030."),
  rating: z.coerce
    .number({ invalid_type_error: "Rating is required." })
    .min(0, "Rating must be at least 0.")
    .max(10, "Rating must be at most 10."),
  genre: z
    .string()
    .min(1, "Genre is required.")
    .refine(
      (value) => value.split(",").map((item) => item.trim()).filter(Boolean).length > 0,
      "Please enter at least one genre tag."
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description must be at most 500 characters."),
  thumbnail_url: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^https?:\/\/.+/i.test(value), "Thumbnail URL must be valid."),
  watch_url: z.string().url("Watch URL must be valid."),
  is_published: z.boolean()
});

const defaultMovieValues = {
  title: "",
  language: "Hindi Dubbed",
  year: new Date().getFullYear(),
  rating: 0,
  genre: "",
  description: "",
  thumbnail_url: "",
  watch_url: "",
  is_published: true
};

const normalizeInitialValues = (initialValues = {}) => ({
  ...defaultMovieValues,
  ...initialValues,
  genre: Array.isArray(initialValues.genre)
    ? initialValues.genre.join(", ")
    : (initialValues.genre ?? defaultMovieValues.genre)
});

const FieldError = ({ message }) =>
  message ? <p className="mt-2 text-sm text-red-400">{message}</p> : null;

export default function MovieForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Movie"
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: normalizeInitialValues(initialValues)
  });

  useEffect(() => {
    reset(normalizeInitialValues(initialValues));
  }, [initialValues, reset]);

  const thumbnailUrl = watch("thumbnail_url");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-[1.75rem] border border-white/5 bg-panelSoft p-4 shadow-panel sm:rounded-[2rem] sm:p-6 md:p-8"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Movie Details</h2>
        <p className="text-sm text-slate-400">
          Keep the form compact on mobile and complete the publishing details in one pass.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Title</label>
          <input
            {...register("title")}
            className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
            placeholder="Movie title"
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Language</label>
          <select
            {...register("language")}
            className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
          >
            <option value="Hindi Dubbed">Hindi Dubbed</option>
            <option value="South Dubbed">South Dubbed</option>
            <option value="English">English</option>
            <option value="Bollywood">Bollywood</option>
            <option value="Multi Audio">Multi Audio</option>
          </select>
          <FieldError message={errors.language?.message} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Year</label>
          <input
            type="number"
            {...register("year")}
            className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
          />
          <FieldError message={errors.year?.message} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            {...register("rating")}
            className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
          />
          <FieldError message={errors.rating?.message} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">Genre tags</label>
        <input
          {...register("genre")}
          className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
          placeholder="Action, Thriller, Drama"
        />
        <FieldError message={errors.genre?.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
        <textarea
          {...register("description")}
          rows={5}
          className="min-h-36 w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
          placeholder="Add a compact movie description"
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Thumbnail URL</label>
            <input
              {...register("thumbnail_url")}
              className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
              placeholder="https://..."
            />
            <FieldError message={errors.thumbnail_url?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Watch URL</label>
            <input
              {...register("watch_url")}
              className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
              placeholder="https://..."
            />
            <FieldError message={errors.watch_url?.message} />
          </div>
        </div>

        <div className="space-y-6">
          <ThumbnailUpload
            value={thumbnailUrl}
            onUploaded={(url) => {
              setValue("thumbnail_url", url, { shouldValidate: true, shouldDirty: true });
            }}
          />

          <div>
            <label className="flex items-start gap-3 rounded-2xl border border-stroke bg-panel px-4 py-3 sm:items-center">
              <input
                type="checkbox"
                {...register("is_published")}
                className="mt-0.5 h-4 w-4 rounded border-stroke bg-panel text-accent focus:ring-accent sm:mt-0"
              />
              <span className="text-sm text-slate-200">Publish movie immediately</span>
            </label>
            <FieldError message={errors.is_published?.message} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">Review the links and status before saving the movie.</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
