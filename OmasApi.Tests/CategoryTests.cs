using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using OmasApi.Controllers;
using OmasApi.Data;
using OmasApi.Data.Entities;
using OmasApi.Data.Repositories;
using Xunit;

namespace OmasApi.Tests
{
    [Collection("OmasApi.Tests")]
    public class CategoryTests
    {
        private readonly CategoriesController _controller;
        private readonly Dictionary<string, object> _seedData;

        public CategoryTests(DatabaseFixture fixture)
        {
            var categoryRepo = new CategoryRepository(fixture.Client);
            var catalogItemRepo = new CatalogItemRepository(fixture.Client);
            _controller = new CategoriesController(categoryRepo, catalogItemRepo);

            _seedData = fixture.SeedData;
        }

        [Fact]
        public async Task ShouldGetCategories()
        {
            // arrange
            var expectedCount = 3;
            var expectedItem = (Category)_seedData["Category 1"];

            // act
            var actual = await _controller.GetAll();

            // assert
            actual.Should().HaveCount(expectedCount);
            actual.Should().ContainEquivalentOf(expectedItem);
        }

        [Fact]
        public async Task ShouldAddCategory()
        {
            // arrange
            var category = new Category
            {
                Name = "New Category",
                Description = "A New Category"
            };

            var expectedCount = 4;

            // act
            var actualAdded = await _controller.Post(category);
            var actualNew = await _controller.GetAll();

            // assert
            actualAdded.Should().BeEquivalentTo(category);
            actualNew.Should().HaveCount(expectedCount);
        }

        [Fact]
        public async Task ShouldResequenceCategories()
        {
            // arrange
            var cat1 = (Category)_seedData["Category 1"];

            // act
            await _controller.MoveDown(cat1.CategoryId);
            var actual = await _controller.GetAll();

            // assert
            actual.Find(c => c.Name == "Category 1").Sequence.Should().Be(2);
            actual.Find(c => c.Name == "Category 2").Sequence.Should().Be(1);
            actual.Find(c => c.Name == "Category 3").Sequence.Should().Be(3);
        }

        [Fact]
        public async Task ShouldDeleteCategory()
        {
            // arrange
            var cat2 = (Category)_seedData["Category 2"];

            // act
            await _controller.Delete(cat2.CategoryId);
            var actual = await _controller.GetAll();

            // assert
            actual.Should().HaveCount(2);
            actual.Find(c => c.Name == "Category 1").Sequence.Should().Be(1);
            actual.Find(c => c.Name == "Category 3").Sequence.Should().Be(2);
            actual.Should().NotContain(c => c.Name == "Category 2");
        }
    }
}
