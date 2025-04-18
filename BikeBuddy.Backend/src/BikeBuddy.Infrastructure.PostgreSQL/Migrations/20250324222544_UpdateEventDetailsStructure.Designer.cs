﻿// <auto-generated />
using System;
using BikeBuddy.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BikeBuddy.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250324222544_UpdateEventDetailsStructure")]
    partial class UpdateEventDetailsStructure
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("BikeBuddy.Domain.Models.AuthControl.AuthUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("email");

                    b.Property<bool>("IsVerified")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false)
                        .HasColumnName("is_verified");

                    b.Property<DateTime?>("LastLoginAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_login_at");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("password_hash");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)")
                        .HasColumnName("user_name");

                    b.HasKey("Id")
                        .HasName("pk_auth_users");

                    b.ToTable("auth_users", (string)null);
                });

            modelBuilder.Entity("BikeBuddy.Domain.Models.AuthControl.UserRefreshToken", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<DateTime>("ExpiresAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("expires_at");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("refresh_token");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_user_refresh_tokens");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_user_refresh_tokens_user_id");

                    b.ToTable("user_refresh_tokens", (string)null);
                });

            modelBuilder.Entity("BikeBuddy.Domain.Models.EventControl.Event", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<string>("BicycleType")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("bicycle_type");

                    b.Property<int>("CountMembers")
                        .HasColumnType("integer")
                        .HasColumnName("count_members");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<Guid?>("CreatedBy")
                        .HasColumnType("uuid")
                        .HasColumnName("created_by");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(800)
                        .HasColumnType("character varying(800)")
                        .HasColumnName("description");

                    b.Property<int>("Distance")
                        .HasColumnType("integer")
                        .HasColumnName("distance");

                    b.Property<string>("EndAddress")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasColumnName("end_address");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("end_date");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("name");

                    b.Property<string>("StartAddress")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasColumnName("start_address");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("start_date");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("status");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("type");

                    b.Property<DateTime?>("UpdatedAt")
                        .ValueGeneratedOnUpdate()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.HasKey("Id")
                        .HasName("pk_events");

                    b.HasIndex("CreatedBy")
                        .HasDatabaseName("ix_events_created_by");

                    b.ToTable("events", (string)null);
                });

            modelBuilder.Entity("BikeBuddy.Domain.Models.ProfileControl.UserProfile", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime?>("BirthDay")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("birth_day");

                    b.Property<string>("MiddleName")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("middle_name");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("name");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("surname");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_user_profiles");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasDatabaseName("ix_user_profiles_user_id");

                    b.ToTable("user_profiles", (string)null);
                });

            modelBuilder.Entity("BikeBuddy.Domain.Models.AuthControl.UserRefreshToken", b =>
                {
                    b.HasOne("BikeBuddy.Domain.Models.AuthControl.AuthUser", "AuthUser")
                        .WithMany("RefreshTokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_user_refresh_tokens_auth_users_user_id");

                    b.Navigation("AuthUser");
                });

            modelBuilder.Entity("BikeBuddy.Domain.Models.EventControl.Event", b =>
                {
                    b.HasOne("BikeBuddy.Domain.Models.AuthControl.AuthUser", "User")
                        .WithMany("Events")
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.SetNull)
                        .HasConstraintName("fk_events_auth_users_created_by");

                    b.OwnsOne("BikeBuddy.Domain.Models.EventControl.ValueObjects.EventDetails", "Details", b1 =>
                        {
                            b1.Property<Guid>("EventId")
                                .HasColumnType("uuid");

                            b1.HasKey("EventId");

                            b1.ToTable("events");

                            b1.ToJson("details");

                            b1.WithOwner()
                                .HasForeignKey("EventId")
                                .HasConstraintName("fk_events_events_id");

                            b1.OwnsMany("BikeBuddy.Domain.Models.EventControl.ValueObjects.PointDetails", "Routes", b2 =>
                                {
                                    b2.Property<Guid>("EventDetailsEventId")
                                        .HasColumnType("uuid");

                                    b2.Property<int>("Id")
                                        .ValueGeneratedOnAdd()
                                        .HasColumnType("integer");

                                    b2.Property<string>("Address")
                                        .IsRequired()
                                        .HasMaxLength(800)
                                        .HasColumnType("character varying(800)");

                                    b2.Property<int>("OrderId")
                                        .HasColumnType("integer");

                                    b2.HasKey("EventDetailsEventId", "Id");

                                    b2.ToTable("events");

                                    b2.ToJson("details");

                                    b2.WithOwner()
                                        .HasForeignKey("EventDetailsEventId")
                                        .HasConstraintName("fk_events_events_event_details_event_id");

                                    b2.OwnsOne("BikeBuddy.Domain.Models.EventControl.ValueObjects.Point", "Point", b3 =>
                                        {
                                            b3.Property<Guid>("PointDetailsEventDetailsEventId")
                                                .HasColumnType("uuid");

                                            b3.Property<int>("PointDetailsId")
                                                .HasColumnType("integer");

                                            b3.Property<string>("Lat")
                                                .IsRequired()
                                                .HasMaxLength(50)
                                                .HasColumnType("character varying(50)");

                                            b3.Property<string>("Lon")
                                                .IsRequired()
                                                .HasMaxLength(50)
                                                .HasColumnType("character varying(50)");

                                            b3.HasKey("PointDetailsEventDetailsEventId", "PointDetailsId")
                                                .HasName("pk_events");

                                            b3.ToTable("events");

                                            b3.ToJson("details");

                                            b3.WithOwner()
                                                .HasForeignKey("PointDetailsEventDetailsEventId", "PointDetailsId")
                                                .HasConstraintName("fk_events_events_point_details_event_details_event_id_point_details_id");
                                        });

                                    b2.Navigation("Point")
                                        .IsRequired();
                                });

                            b1.Navigation("Routes");
                        });

                    b.Navigation("Details")
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("BikeBuddy.Domain.Models.ProfileControl.UserProfile", b =>
                {
                    b.HasOne("BikeBuddy.Domain.Models.AuthControl.AuthUser", "AuthUser")
                        .WithOne("UserProfile")
                        .HasForeignKey("BikeBuddy.Domain.Models.ProfileControl.UserProfile", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_user_profiles_auth_users_user_id");

                    b.OwnsOne("BikeBuddy.Domain.Models.ProfileControl.Address", "Address", b1 =>
                        {
                            b1.Property<Guid>("UserProfileId")
                                .HasColumnType("uuid");

                            b1.Property<string>("City")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<string>("Country")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.HasKey("UserProfileId");

                            b1.ToTable("user_profiles");

                            b1.ToJson("address");

                            b1.WithOwner()
                                .HasForeignKey("UserProfileId")
                                .HasConstraintName("fk_user_profiles_user_profiles_id");
                        });

                    b.Navigation("Address")
                        .IsRequired();

                    b.Navigation("AuthUser");
                });

            modelBuilder.Entity("BikeBuddy.Domain.Models.AuthControl.AuthUser", b =>
                {
                    b.Navigation("Events");

                    b.Navigation("RefreshTokens");

                    b.Navigation("UserProfile")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
