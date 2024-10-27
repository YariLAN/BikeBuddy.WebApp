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
    [Migration("20241026203709_OneToMany_User_Refresh")]
    partial class OneToMany_User_Refresh
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

            modelBuilder.Entity("BikeBuddy.Domain.Models.UserProfile", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime?>("BirthDay")
                        .HasColumnType("timestamp without time zone")
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

            modelBuilder.Entity("BikeBuddy.Domain.Models.UserProfile", b =>
                {
                    b.HasOne("BikeBuddy.Domain.Models.AuthControl.AuthUser", "AuthUser")
                        .WithOne("UserProfile")
                        .HasForeignKey("BikeBuddy.Domain.Models.UserProfile", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_user_profiles_auth_users_user_id");

                    b.OwnsOne("BikeBuddy.Domain.Models.Address", "Address", b1 =>
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
                    b.Navigation("RefreshTokens");

                    b.Navigation("UserProfile")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
